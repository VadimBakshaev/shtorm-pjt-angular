import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ModalDataType } from '../../../../types/modal-data.type';

@Component({
  selector: 'modal-component',
  standalone: false,
  templateUrl: './modal-component.html',
  styleUrl: './modal-component.scss',
})
export class ModalComponent {
  protected dialogRef = inject(DialogRef);
  protected data: ModalDataType = inject(DIALOG_DATA);

}
