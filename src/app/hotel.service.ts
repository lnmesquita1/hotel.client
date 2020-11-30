import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CheckIn } from './models/checkin.model';
import { Hospede } from './models/hospede.model';
import { HOTEL_API } from './hotel.conf';

@Injectable()
export class HotelService {

	constructor(private http: HttpClient) {}
	
	createCheckIn(checkIn: CheckIn) {
    return this.http.post(
      `${HOTEL_API}/api/checkin`, checkIn
    );
  }

	createHospede(hospede: Hospede) {
    return this.http.post(
      `${HOTEL_API}/api/hospede`, hospede
    );
  }

  findAllGuests() {
    return this.http.get(`${HOTEL_API}/api/hospede/all`);
  }

  findHostedGuests() {
    return this.http.get(`${HOTEL_API}/api/hospede/hosted`);
  }

  findLeftGuests() {
    return this.http.get(`${HOTEL_API}/api/hospede/left`);
  }

}