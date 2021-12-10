'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const helper = require('./helper');
/**
 * Workload module for the benchmark round.
 */
class QueryAllCarsWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.startingKey = '';
        this.endingKey = '';
    }
    /**
     * Initialize the workload module with the given parameters.
     * @param {number} workerIndex The 0-based index of the worker instantiating the workload module.
     * @param {number} totalWorkers The total number of workers participating in the round.
     * @param {number} roundIndex The 0-based index of the currently executing round.
     * @param {Object} roundArguments The user-provided arguments for the round from the benchmark configuration file.
     * @param {BlockchainInterface} sutAdapter The adapter of the underlying SUT.
     * @param {Object} sutContext The custom context object provided by the SUT adapter.
     * @async
     */
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        await helper.createCar(this.sutAdapter, this.workerIndex, this.roundArguments);

        this.startingKey = 'Client' + this.workerIndex + '_CAR' + this.roundArguments.startKey;
        this.endingKey = 'Client' + this.workerIndex + '_CAR' + this.roundArguments.endKey;
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        let args = {
            contractId: 'fabcar',
            contractVersion: 'v1',
            contractFunction: 'queryAllCars',
            contractArguments: [],
            timeout: 60,
            readOnly: true
        };

        await this.sutAdapter.sendRequests(args);
    }
}
/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new QueryAllCarsWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
