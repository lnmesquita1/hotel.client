import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { HotelService } from './hotel.service';
import { CheckIn } from './models/checkin.model';
import { Hospede } from './models/hospede.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public formCheckin: FormGroup;

  public formHospede: FormGroup;

  public listGuestsSelect: Array<Hospede> = null;

  public listGuests: Array<any> = null;

  public searchType: string = 'all';

  public successMessage: string = null;

  public errorMessage: string = null;

  constructor(
    private localeService: BsLocaleService,
    private fb: FormBuilder,
    private service: HotelService
  ) {}

  ngOnInit() {
    this.localeService.use('pt-br');
    this.formCheckin = this.fb.group(new CheckIn());
    this.formHospede = this.fb.group(new Hospede());
    this.setValidations(this.formCheckin, this.validationsCheckIn());
    this.setValidations(this.formHospede, this.validationsHospede());
    this.getAllGuestsSelect();
    this.getList();
  }

  submitCheckIn() {
    Object.values(this.formCheckin.controls).forEach((item) => {
      item.markAsDirty();
    });

    if (this.formCheckin.valid) {
      this.service.createCheckIn(this.formCheckin.value).subscribe(
        (res: any) => {
          if (res.data) {
            this.showSuccessMessage('Check in realizado com sucesso!');
            this.getList();
            this.formCheckin.setValue(new CheckIn());
            this.setValidations(this.formCheckin, this.validationsCheckIn());
            this.formCheckin.markAsPristine();
          }
        },
        () => {
          this.showErrorMessage('Ocorreu um erro ao realizar o check in');
        }
      );
    }
  }

  submitHospede(modal) {
    Object.values(this.formHospede.controls).forEach((item) => {
      item.markAsDirty();
    });
    if (this.formHospede.valid) {
      this.service.createHospede(this.formHospede.value).subscribe(
        (res: any) => {
          if (res.data) {
            this.showSuccessMessage('Cadastro realizado com sucesso!');
            this.getList();
            this.getAllGuestsSelect();
            this.formHospede.setValue(new Hospede());
            this.setValidations(this.formHospede, this.validationsHospede());
            this.formHospede.markAsPristine();
            modal.hide();
          }
        },
        () => {
          this.showErrorMessage('Ocorreu um erro ao tentar cadastrar o hóspede');
        }
      );
    }
  }

  async getAllGuestsSelect() {
    this.service.findAllGuests().subscribe(
      (res: any) => {
        if (res.data) {
          const list: Array<any> = res.data;
          if (list) {
            this.listGuestsSelect = list;
          }
        }
      },
      () => {
        this.showErrorMessage('Erro ao listar os hóspedes');
      }
    );
  }

  getAllGuests() {
    this.service.findAllGuests().subscribe(
      (res: any) => {
        if (res.data) {
          const list: Array<any> = res.data;
          if (list) {
            this.listGuests = list;
          }
        }
      },
      () => {
        this.showErrorMessage('Erro ao listar os hóspedes');
      }
    );
  }

  getHostedGuests() {
    this.service.findHostedGuests().subscribe(
      (res: any) => {
        if (res.data) {
          const list: Array<any> = res.data;
          if (list) {
            this.listGuests = list;
          }
        }
      },
      () => {
        this.showErrorMessage('Erro ao listar os hóspedes');
      }
    );
  }

  getLeftGuests() {
    this.service.findLeftGuests().subscribe((res: any) => {
      const list: Array<any> = res.data;
      if (list) {
        this.listGuests = list;
      }
    },
    () => {
      this.showErrorMessage('Erro ao listar os hóspedes');
    });
  }

  getList() {
    if (this.searchType === 'hostedGuests') {
      this.getHostedGuests();
    } else if (this.searchType === 'leftGuests') {
      this.getLeftGuests();
    } else {
      this.getAllGuests();
    }
  }

  changeSearchType() {
    this.getList();
  }

  validationsCheckIn() {
    const validations = {
      hospede: Validators.required,
      dataEntrada: Validators.required,
      dataSaida: Validators.required,
    };
    return validations;
  }

  validationsHospede() {
    const validations = {
      nome: Validators.required,
      documento: Validators.required,
      telefone: Validators.required,
    };
    return validations;
  }

  setValidations(form: FormGroup, validations) {
    for (const key in form.controls) {
      const validation = validations[key] ? validations[key] : null;
      form.controls[key].setValidators(validation);
      form.controls[key].updateValueAndValidity();
    }
  }

  showErrorMessage(message) {
    this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
  }

  showSuccessMessage(message) {
    this.successMessage = message;
      setTimeout(() => {
        this.successMessage = null;
      }, 5000);
  }
}
