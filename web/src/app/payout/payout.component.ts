import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PayoutsService } from '../payouts.service';
import { Inject } from '@angular/core';

export interface PayoutSchema {
  name: string;
  amount: number;
}
const PAYOUT_DATA: PayoutSchema[] = [
  { "name": "Adriana", "amount": 5.75 },
  { "name": "Adriana", "amount": 5.75 },
  { "name": "Bao", "amount": 12 }
];

const COLUMNS_SCHEMA = [
  {
    key: "name",
    type: "text",
    label: "Name"
  },
  {
    key: "amount",
    type: "number",
    label: "Amount"
  },
  {
    key: "isEdit",
    type: "isEdit",
    label: ""
  }
]

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.scss']
})

export class PayoutComponent {
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);;
  dataSource: any = PAYOUT_DATA;
  columnsSchema: any = COLUMNS_SCHEMA;
  constructor(private payoutsService: PayoutsService, public dialog: MatDialog) { }

  addNew() {
    const newRecord: PayoutSchema = {
      name: "Add Name",
      amount: 1
    }
    const newData = [...this.dataSource];
    newData.push(newRecord);
    this.dataSource = newData;
  }

  openDialog(res:any={test:"test"}) {
    const dialogRef = this.dialog.open(PayoutResponseDialog,{width: '400px',
    height: 'auto',data:res});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  submitData() {
    this.payoutsService.calculatePayout(this.dataSource, 'payouts').subscribe(res => { 
      console.log(res)
      this.openDialog(res)
    });
  }
}


@Component({
  selector: 'payout-response-dialog',
  templateUrl: 'payout-response-dialog.html',
})
export class PayoutResponseDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  
  ngOnInit() {
    // will log the entire data object
    console.log(this.data)
  }
 
}


