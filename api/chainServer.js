const express = require("express");
const bodyParser = require("body-parser");
const N3 = require("n3");

const Blockchain = require("senshamartproject/blockchain/blockchain");
const BlockchainProp = require("senshamartproject/network/blockchain-prop");
const Wallet = require("senshamartproject/wallet/wallet");
const ChainUtil = require("senshamartproject/util/chain-util");
const QueryEngine = require("@comunica/query-sparql-rdfjs").QueryEngine;
const SensorRegistration = require("senshamartproject/blockchain/sensor-registration");
const BrokerRegistration = require("senshamartproject/blockchain/broker-registration");

("use strict");

const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false,
});

rl.once("line", (line) => {
	const cfg = JSON.parse(line);
	console.log(`received config: ${JSON.stringify(cfg)}`);
	serve_chain(cfg);
	rl.close();
});

async function serve_chain(cfg) {
	const keyPair = ChainUtil.genKeyPair();
	if (cfg.wallet_key !== "") {
		const keyPair = ChainUtil.deserializeKeyPair(cfg.wallet_key);
	}
	const wallet = new Wallet(keyPair);

	console.log(`loading blochain from: ${cfg.blockchain_location}`);
	const blockchain = Blockchain.loadFromDisk(cfg.blockchain_location);
	const chainServer = new BlockchainProp("Wallet-chain-server", blockchain);

	(async () => {
		console.log("starting chain server");
		chainServer.start(
			cfg.chain_server_port,
			cfg.chain_server_public_address,
			cfg.chain_server_peers
		);
	})();

	const app = express();
	app.use(bodyParser.json());
	app.listen(cfg.api_port, () =>
		console.log(`API Listening on port ${cfg.api_port}`)
	);

	app.get("/ChainServer/sockets", (req, res) => {
		res.json(chainServer.sockets);
	});
	app.post("/ChainServer/connect", (req, res) => {
		chainServer.connect(req.body.url);
		res.json("Connecting");
	});

	app.get("/public-key", (req, res) => {
		res.json(wallet.publicKey);
	});

	app.get("/key-pair", (req, res) => {
		res.json(ChainUtil.serializeKeyPair(wallet.keyPair));
	});

	app.get("/MyBalance", (req, res) => {
		res.json(blockchain.getBalanceCopy(wallet.publicKey));
	});
	app.get("/chain-length", (req, res) => {
		res.json(blockchain.blocks().length);
	});
	app.get("/Balance", (req, res) => {
		const balance = blockchain.getBalanceCopy(req.body.publicKey);
		res.json(balance);
	});
	app.get("/Balances", (req, res) => {
		const balances = blockchain.chain.balances.current;
		res.json(balances);
	});
	app.get("/Sensors", (req, res) => {
		const returning = {};
		for (const [key, value] of Object.entries(
			blockchain.chain.sensors.current
		)) {
			const created = {};
			Object.assign(created, value);
			created.hash = SensorRegistration.hashToSign(created);
			returning[key] = created;
		}
		res.json(returning);
		console.log("/Sensors called");
		console.log(`Returned ${Object.entries(returning).length} sensors`);
	});
	app.get("/Brokers", (req, res) => {
		const returning = {};
		for (const [key, value] of Object.entries(
			blockchain.chain.brokers.current
		)) {
			const created = {};
			Object.assign(created, value);
			created.hash = BrokerRegistration.hashToSign(created);
			returning[key] = created;
		}
		res.json(returning);
	});
	app.get("/Integrations", (req, res) => {
		res.json(blockchain.chain.integrations.current);
	});

	app.post("/Payment", (req, res) => {
		console.log(JSON.stringify(req.body));
		const rewardAmount = req.body.rewardAmount;
		const outputs = req.body.outputs;

		const payment = wallet.createPaymentAsTransaction(
			blockchain,
			rewardAmount,
			outputs
		);

		chainServer.sendTx(payment);

		res.json(payment.transaction);
	});

	app.post("/Integration", (req, res) => {
		try {
			const integration = wallet.createIntegrationAsTransaction(
				blockchain,
				req.body.rewardAmount,
				req.body.witnessCount,
				req.body.outputs
			);

			chainServer.sendTx(integration);

			res.json({
				result: true,
				tx: integration.transaction,
				hash: integration.type.hashToSign(integration.transaction),
			});
		} catch (err) {
			console.log(err);
			res.json({
				result: false,
				reason: err.message,
			});
		}
	});

	const brokerRegistrationValidators = {
		brokerName: ChainUtil.validateIsString,
		endpoint: ChainUtil.validateIsString,
		rewardAmount: ChainUtil.createValidateIsIntegerWithMin(0),
		extraNodeMetadata: ChainUtil.createValidateOptional(
			ChainUtil.validateIsObject
		),
		extraLiteralMetadata: ChainUtil.createValidateOptional(
			ChainUtil.validateIsObject
		),
	};

	app.post("/BrokerRegistration", (req, res) => {
		const validateRes = ChainUtil.validateObject(
			req.body,
			brokerRegistrationValidators
		);

		if (!validateRes.result) {
			res.json(validateRes.reason);
			return;
		}

		try {
			const reg = wallet.createBrokerRegistrationAsTransaction(
				blockchain,
				req.body.rewardAmount,
				req.body.brokerName,
				req.body.endpoint,
				req.body.extraNodeMetadata,
				req.body.extraLiteralMetadata
			);

			chainServer.sendTx(reg);

			res.json(reg.transaction);
		} catch (err) {
			console.log(err);
			res.json(err.message);
		}
	});

	const sensorRegistrationValidators = {
		sensorName: ChainUtil.validateIsString,
		costPerMinute: ChainUtil.createValidateIsIntegerWithMin(0),
		costPerKB: ChainUtil.createValidateIsIntegerWithMin(0),
		integrationBroker: ChainUtil.validateIsString,
		rewardAmount: ChainUtil.createValidateIsIntegerWithMin(0),
		extraNodeMetadata: ChainUtil.createValidateOptional(
			ChainUtil.validateIsObject
		),
		extraLiteralMetadata: ChainUtil.createValidateOptional(
			ChainUtil.validateIsObject
		),
	};

	app.post("/SensorRegistration", (req, res) => {
		const validateRes = ChainUtil.validateObject(
			req.body,
			sensorRegistrationValidators
		);

		if (!validateRes.result) {
			res.json({
				result: false,
				reason: validateRes.reason,
			});
			return;
		}

		try {
			const reg = wallet.createSensorRegistrationAsTransaction(
				blockchain,
				req.body.rewardAmount,
				req.body.sensorName,
				req.body.costPerMinute,
				req.body.costPerKB,
				req.body.integrationBroker,
				req.body.extraNodeMetadata,
				req.body.extraLiteralMetadata
			);

			chainServer.sendTx(reg);

			res.json({
				result: true,
				tx: reg.transaction,
			});
		} catch (err) {
			console.log(err);
			res.json({
				result: false,
				reason: err.message,
			});
		}
	});

	const myEngine = new QueryEngine();

	app.post("/sparql", (req, res) => {
		if (!("query" in req.body)) {
			res.json({
				result: false,
				reason: "No query supplied",
			});
			return;
		}
		const start = async function() {
			try {
				const result = [];
				const bindingsStream = await myEngine.queryBindings(
					req.body.query,
					{
						readOnly: true,
						sources: [blockchain.rdfSource()],
					}
				);
				bindingsStream.on("data", (binding) => {
					result.push(binding.entries);
				});
				bindingsStream.on("end", () => {
					res.json({
						result: true,
						values: result,
					});
				});
				bindingsStream.on("error", (err) => {
					res.json({
						result: false,
						reason: err,
					});
				});
			} catch (err) {
				console.error("Exception!");
				console.error(err);
				res.json({
					result: false,
					reason: err.message,
				});
			}
		};

		start();
	});
	console.log("finished api setup");
}
