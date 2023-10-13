import { render, fireEvent, screen } from "@solidjs/testing-library";
import Heading from "./heading"; 

test("Heading renders the provided text", () => {
const headingtext = "text1" 
const { container } = render(() => <Heading text={headingtext} />);
const heading = container.querySelector("h1")
expect(heading.textContent).toBe(headingtext)
});
