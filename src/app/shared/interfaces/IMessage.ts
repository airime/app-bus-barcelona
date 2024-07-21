export interface IMessage<T> {
    tag: string,
    content: T
}

export interface ITextMessage extends IMessage<string> {
    tag: "text"
 }
export interface IErrorMessage extends IMessage<string> {
    tag: "error",
    name: string
}
export interface IErrorDismissedMessage extends IMessage<undefined> {
    tag: "dismissError"
}
export interface IPositionMessage extends IMessage<google.maps.LatLngLiteral> {
    tag: "position"
}
