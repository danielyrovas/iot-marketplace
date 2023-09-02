export function set_field_message(element, msg, _) {
    element.classList.add("input-error");
    element.invalid = true;
    element.invalidMsg = msg;
}
export function clear_field_message(element, _) {
    element.classList.remove("input-error");
    element.invalid = false;
}
