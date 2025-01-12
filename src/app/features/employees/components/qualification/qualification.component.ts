import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-qualification',
  standalone: false,
  templateUrl: './qualification.component.html',
  styleUrl: './qualification.component.css'
})
export class QualificationComponent {
  public qualificationForm : FormGroup
  public qualificationDropDown = ['Class 10','Class 12/Equivalent','UG/Equivalent','Masters/Equvivalent','Ph. D/Equivalent','Others'];
  public selectedQualificationArray:string[] = [];
  public selectedQual:string =''
  @ViewChild('selectedQualification') selectedQualification!: ElementRef;
  constructor(private fb: FormBuilder){
    this.qualificationForm = this.fb.group({
    fields: this.fb.array([])
    })
  }

  get qualificationGroup(): FormArray<FormGroup>{
    return this.qualificationForm.get('fields') as FormArray<FormGroup>;
  }

  addQualificationGroup(){
    const singleQualification =this.fb.group({
      educationQualification : [''],
      educationInstituteName: [''],
      educationBoardName: [''],
      educationSpecialization: [''],
      yearOfCompletion: [''],
      percentage: [''],
      certificate: ['']
    })
    this.qualificationGroup.push(singleQualification);
  }

  checkAndAddQualification(){
    if(this.selectedQualificationArray.includes(this.selectedQual)){

    }else{
      this.selectedQualificationArray.push(this.selectedQual)
      this.addQualificationGroup()
    }
  }

  removeFields(index: number) {
    this.qualificationGroup.removeAt(index);
    this.selectedQualificationArray.splice(index,1);
  }


}
