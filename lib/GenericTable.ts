export interface TableProps {
    tableName : string,
    primaryKey : string,
    connectLambdaPath ?: string,
    disconnectLambdaPath ?: string,
    onMessageLambdaPath ?: string
}
export class GenericTable {
    private
}