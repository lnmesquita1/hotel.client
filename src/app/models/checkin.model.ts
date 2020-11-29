import { Hospede } from './hospede.model';

export class CheckIn {
    constructor(
        public id: number = null,
        public hospede: Hospede = null,
        public dataEntrada: Date = null,
        public dataSaida: Date = null,
        public adicionalVeiculo: boolean = false
    ){}
}