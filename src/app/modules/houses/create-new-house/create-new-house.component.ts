import { Component, OnInit } from '@angular/core';
declare const Quill: any;
declare const Choices: any;

@Component({
  selector: 'app-create-new-house',
  templateUrl: './create-new-house.component.html',
  styleUrls: ['./create-new-house.component.css']
})
export class CreateNewHouseComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    if (document.getElementById('areas')) {
      var skills = document.getElementById('areas');
      const example = new Choices(skills, {
        delimiter: ',',
        editItems: true,
        maxItemCount: 10,
        removeItemButton: true,
        addItems: true
      });
    }

  }

}
