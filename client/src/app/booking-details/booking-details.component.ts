import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {

  formModel: any = {eventID:null, status: null };
  showError: boolean = false;
  errorMessage: any;
  eventObj: any = [];
  allocations: any = [];
  assignModel: any = {};

  showMessage: any;
  responseMessage: any;
  isUpdate: any = false;
  listOfAllocation : any = [];
  userId:number = -1;
  first: boolean = false;
  constructor(public router: Router, public httpService: HttpService, private formBuilder: FormBuilder, private authService: AuthService) {
    if(authService.getRole != 'CLIENT'){      
      router.navigateByUrl('dashboard')
    }
  }
  ngOnInit(): void {
    console.log(this.eventObj);
    
    this.httpService.getAllUser().subscribe((data:any)=>{
      for(let user of data){
        if(user.username == this.authService.getUsername){
          this.userId = user.userID;
        }
      }
    });
    this.httpService.GetAlleventsForClient().subscribe((data:any)=>{
      for(let event of data){
        if(event.user.userID == this.userId){
          this.eventObj.push(event);
        }
      }
    });        
  }
  searchEvent() {
    debugger;
    this.first = true;
    console.log(this.userId );
    
    if (this.formModel.eventID != null) {
      this.isUpdate = false;
      console.log(this.formModel.eventID);
      
      this.httpService.getBookingDetails(this.formModel.eventID).subscribe((data: any) => {
        if(data.user.userID == this.userId){
          this.eventObj = [data];
          console.log(this.eventObj);
          
          this.httpService.getAllAllocationByEventId(this.formModel.eventID).subscribe((data1:any)=>{
            this.listOfAllocation = data1;
            console.log(data);
          })
        }else{
          this.eventObj = [];
          this.listOfAllocation = [];
        }
        console.log(this.eventObj);
      }, error => {
        // Handle error
        this.showError = true;
        this.errorMessage = "An error occurred.. Please try again later.";
        console.error('Login error:', error);
      });
    }

  }
}

