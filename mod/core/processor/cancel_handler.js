/**
 * @author Pedro Sanders
 * @since v1
 */
const SipFactory = Java.type('javax.sip.SipFactory')
const Response = Java.type('javax.sip.message.Response')
const LogManager = Java.type('org.apache.logging.log4j.LogManager')
const LOG = LogManager.getLogger()

class CancelHandler {

    constructor(sipProvider, contextStorage) {
        this.sipProvider = sipProvider
        this.contextStorage = contextStorage
        this.messageFactory = SipFactory.getInstance().createMessageFactory()
    }

    doProcess(request, serverTransaction) {
        const storage = this.contextStorage.getStorage()
        const iterator = storage.iterator()

        while (iterator.hasNext()) {
            const context = iterator.next()
            if (context.serverTransaction && context.serverTransaction.getBranchId()
                .equals(serverTransaction.getBranchId())) {

                let originRequest = context.requestIn
                let originResponse = this.messageFactory.createResponse(Response.REQUEST_TERMINATED, originRequest)
                let cancelResponse = this.messageFactory.createResponse(Response.OK, request)
                let cancelRequest = context.clientTransaction.createCancel()
                let clientTransaction = this.sipProvider.getNewClientTransaction(cancelRequest)

                context.serverTransaction.sendResponse(originResponse)
                serverTransaction.sendResponse(cancelResponse)
                clientTransaction.sendRequest()

                LOG.trace('Original response: ' + originResponse)
                LOG.trace('Cancel response: ' + cancelResponse)
                LOG.trace('Cancel request: ' + cancelRequest)
            }
        }
        LOG.debug(request)
    }
}

module.exports = CancelHandler
