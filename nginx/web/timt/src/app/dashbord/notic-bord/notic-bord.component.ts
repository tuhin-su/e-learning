import { Component, OnInit } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { NotisBordService } from 'src/service/NoticBord/notis-bord.service';
@Component({
  selector: 'app-notic-bord',
  templateUrl: './notic-bord.component.html',
  styleUrls: ['./notic-bord.component.scss']
})
export class NoticBordComponent implements OnInit {

  constructor(private service: NotisBordService) { }

  async ngOnInit() {
    // await firstValueFrom(this.service.getNotices().pipe(
    //   tap(
    //     (res)=>{
    //       if (res) {
    //         console.log(res)
    //       }
    //     }
    //   )
    // ));
  }

}
