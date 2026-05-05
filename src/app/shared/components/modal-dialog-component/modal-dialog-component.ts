import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RequestService } from '../../services/request-service';
import { map, catchError, of } from 'rxjs';
import { DetectResponseUtilite } from '../../utils/detect-response-utilite';
import { CategoryType } from '../../../../types/category.type';
import { form, required } from '@angular/forms/signals';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { OrderRequestParamsType, RequestParamsType } from '../../../../types/request-params.type';
import { ModalDataType } from '../../../../types/modal-data.type';

interface RequestType {
  name: string;
  phone: string;
  service: string;
}

@Component({
  selector: 'modal-dialog-component',
  standalone: false,
  templateUrl: './modal-dialog-component.html',
  styleUrl: './modal-dialog-component.scss',
})
export class ModalDialogComponent {
  private readonly requestService = inject(RequestService);
  private readonly destroyRef = inject(DestroyRef);

  protected dialogRef = inject(DialogRef);
  protected data: ModalDataType = inject(DIALOG_DATA);

  protected isFailRequest = signal<boolean>(false);
  protected isRequestDone = signal<boolean>(false);
  protected categories = (this.data.type === 'order') ?
    toSignal(this.requestService.getCategories().pipe(
      map(data => {
        if (DetectResponseUtilite.isErrorResponse(data)) {
          console.error(data.message);
          return [] as CategoryType[];
        } else {
          return data;
        }
      }),
      catchError(error => {
        console.error('Failed to load categories:', error);
        return of([] as CategoryType[]);
      })
    ), { initialValue: [] }) : signal([]);

  private formModel = signal<RequestType>({
    name: '',
    phone: '',
    service: ''
  });

  protected requestForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Введите Ваше имя' });
    required(schemaPath.phone, { message: 'Веедите номер телефона' });
  });

  constructor() {
    if (this.data.type === 'order')
      effect(() => {
        const cats = this.categories();
        const initial = cats.find(cat => cat.url === this.data.service);

        if (initial && !this.formModel().service) {
          this.formModel.update(model => ({
            ...model,
            service: initial.name
          }));
        }
      });
  };

  protected sendRequest(): void {
    if (!this.requestForm().valid()) return;

    this.requestService.request(this.buildParamsRequest()).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.isFailRequest.set(data.error);
        this.isRequestDone.set(true);
      },
      error: () => {
        this.isFailRequest.set(true);
        this.isRequestDone.set(false);
      }
    });
  };

  private buildParamsRequest(): OrderRequestParamsType | RequestParamsType {
    let params: OrderRequestParamsType | RequestParamsType;
    if (this.data.type === 'order') {
      params = {
        name: this.requestForm().value().name,
        phone: this.requestForm().value().phone,
        type: this.data.type,
        service: this.requestForm().value().service
      };
    } else {
      params = {
        name: this.requestForm().value().name,
        phone: this.requestForm().value().phone,
        type: this.data.type
      };
    };
    return params;
  };
}
