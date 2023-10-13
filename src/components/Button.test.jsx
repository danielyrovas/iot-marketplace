import { render, fireEvent, screen } from "@solidjs/testing-library";
import Button from "./Button"; 

test("Button renders with the provided text", () => {
const buttontext = "click" 
const { container } = render(() => <Button text={buttontext} />);
const button = container.querySelector("button")
expect(button.textContent).toBe(buttontext)
});


test("Button executed the function when on click is triggered", () => {
let click = false
const handleClick = () => {click = true}
const { container } = render(() => <Button text="Click me" onClick={handleClick}/>); 
const button = container.querySelector("button")
button.click()
expect(click).toBe(true)
});