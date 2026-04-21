import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ModalDialogComponent } from '../../components/modal-dialog-component/modal-dialog-component';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.scss',
})
export class FooterComponent {
  private readonly dialog = inject(Dialog);

  protected openDialog() {
      this.dialog.open(ModalDialogComponent, {
        data: { type: 'consultation', service: '' }
      })
    }
}
