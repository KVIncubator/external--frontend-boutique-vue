import { computed, defineComponent, inject, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import ShoppingCartService from './shopping-cart.service';
import { useValidation, useDateFormat } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import CustomerDetailsService from '@/entities/customer-details/customer-details.service';
import { type ICustomerDetails } from '@/shared/model/customer-details.model';
import { type IShoppingCart, ShoppingCart } from '@/shared/model/shopping-cart.model';
import { OrderStatus } from '@/shared/model/enumerations/order-status.model';
import { PaymentMethod } from '@/shared/model/enumerations/payment-method.model';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ShoppingCartUpdate',
  setup() {
    const shoppingCartService = inject('shoppingCartService', () => new ShoppingCartService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const shoppingCart: Ref<IShoppingCart> = ref(new ShoppingCart());

    const customerDetailsService = inject('customerDetailsService', () => new CustomerDetailsService());

    const customerDetails: Ref<ICustomerDetails[]> = ref([]);
    const orderStatusValues: Ref<string[]> = ref(Object.keys(OrderStatus));
    const paymentMethodValues: Ref<string[]> = ref(Object.keys(PaymentMethod));
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'en'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveShoppingCart = async shoppingCartId => {
      try {
        const res = await shoppingCartService().find(shoppingCartId);
        res.placedDate = new Date(res.placedDate);
        shoppingCart.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.shoppingCartId) {
      retrieveShoppingCart(route.params.shoppingCartId);
    }

    const initRelationships = () => {
      customerDetailsService()
        .retrieve()
        .then(res => {
          customerDetails.value = res.data;
        });
    };

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      placedDate: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      status: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      totalPrice: {
        required: validations.required(t$('entity.validation.required').toString()),
        min: validations.minValue(t$('entity.validation.min', { min: 0 }).toString(), 0),
      },
      paymentMethod: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      paymentReference: {},
      customerDetails: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
    };
    const v$ = useVuelidate(validationRules, shoppingCart as any);
    v$.value.$validate();

    return {
      shoppingCartService,
      alertService,
      shoppingCart,
      previousState,
      orderStatusValues,
      paymentMethodValues,
      isSaving,
      currentLanguage,
      customerDetails,
      v$,
      ...useDateFormat({ entityRef: shoppingCart }),
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.shoppingCart.id) {
        this.shoppingCartService()
          .update(this.shoppingCart)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('boutiqueApp.shoppingCart.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.shoppingCartService()
          .create(this.shoppingCart)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('boutiqueApp.shoppingCart.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
