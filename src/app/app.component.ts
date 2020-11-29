import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { HotelService } from './hotel.service';
import { CheckIn } from './models/checkin.model';
import { Hospede } from './models/hospede.model';
import {
  ToasterService,
  ToasterConfig,
} from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  public toasterconfig: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-bottom-center',
    showCloseButton: true,
    limit: 1
  });

  public formCheckin: FormGroup;

  public formHospede: FormGroup;

  public listGuestsSelect: Array<Hospede> = null;

  public listGuests: Array<any> = null;

  public searchType: string = 'all';

  constructor(
    private localeService: BsLocaleService,
    private fb: FormBuilder,
    private service: HotelService,
    private toasterService: ToasterService,
    ) { }

  ngOnInit() {
    this.localeService.use('pt-br');
    this.formCheckin = this.fb.group(new CheckIn());
    this.formHospede = this.fb.group(new Hospede());
    this.getAllGuestsSelect();
    this.getList();
  }

  async submitCheckIn() {
    await this.service
        .createCheckIn(this.formCheckin.value)
        .toPromise()
        .catch((msg) => msg);
    this.getList();
  }

  submitHospede(modal) {
    this.service.createHospede(this.formHospede.value).subscribe(
      (res: any) => {
        if (res.data) {
          this.getList();
          modal.hide();
        }
      },
      (msg) => {
        this.toasterService.pop('error', null, msg);
      }
    );
  }

  async getAllGuestsSelect() {
    const res = await this.service
      .findAllGuests()
      .toPromise()
      .catch((msg) => msg);
    const list: Array<any> = res['data'];
    if (list) {
      this.listGuestsSelect = list;
    } else {
      this.toasterService.pop('error', null, res);
    }
  }

  async getAllGuests() {
    const res = await this.service
      .findAllGuests()
      .toPromise()
      .catch((msg) => msg);
    const list: Array<any> = res['data'];
    if (list) {
      this.listGuests = list;
    } else {
      this.toasterService.pop('error', null, res);
    }
  }

  async getHostedGuests() {
    const res = await this.service
      .findHostedGuests()
      .toPromise()
      .catch((msg) => msg);
    const list: Array<any> = res['data'];
    if (list) {
      this.listGuests = list;
    } else {
      this.toasterService.pop('error', null, res);
    }
  }

  async getLeftGuests() {
    const res = await this.service
      .findLeftGuests()
      .toPromise()
      .catch((msg) => msg);
    const list: Array<any> = res['data'];
    if (list) {
      this.listGuests = list;
    } else {
      this.toasterService.pop('error', null, res);
    }
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


}
