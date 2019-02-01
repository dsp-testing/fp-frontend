class BehandlingUpdater {
    setUpdater = (updater) => {
      this.updater = updater;
    }

    reset = () => {
      this.updater = undefined;
    }

    changeBehandlendeEnhet = (dispatch, params) => dispatch(this.updater.changeBehandlendeEnhet()(params))

    updateBehandling = (dispatch, behandlingIdentifier) => dispatch(this.updater.updateBehandling()(behandlingIdentifier))

    resetBehandling = dispatch => (this.updater ? dispatch(this.updater.resetBehandling()) : undefined)

    setBehandlingOnHold = (dispatch, params) => dispatch(this.updater.setBehandlingOnHold()(params))

    resumeBehandling = (dispatch, params) => dispatch(this.updater.resumeBehandling()(params))

    shelveBehandling = (dispatch, params) => dispatch(this.updater.shelveBehandling()(params))

    openBehandlingForChanges = (dispatch, params) => dispatch(this.updater.openBehandlingForChanges()(params))

    setBehandlingResult = (dispatch, payload, params, options) => dispatch(this.updater.setBehandlingResult()(payload, params, options))

    resetSubmitMessage = dispatch => dispatch(this.updater.resetSubmitMessage())

    previewMessage = (dispatch, params) => dispatch(this.updater.previewMessage()(params))

    submitMessage = (dispatch, params) => dispatch(this.updater.submitMessage()(params))

    isSubmitMessageFinished = state => this.updater.isSubmitMessageFinished(state)
}

export default new BehandlingUpdater();
