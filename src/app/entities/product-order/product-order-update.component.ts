import { computed, defineComponent, inject, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';

import ProductOrderService from './product-order.service';
import { useValidation } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

import ProductService from '@/entities/product/product.service';
import { type IProduct } from '@/shared/model/product.model';
import ShoppingCartService from '@/entities/shopping-cart/shopping-cart.service';
import { type IShoppingCart } from '@/shared/model/shopping-cart.model';
import { type IProductOrder, ProductOrder } from '@/shared/model/product-order.model';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ProductOrderUpdate',
  setup() {
    const productOrderService = inject('productOrderService', () => new ProductOrderService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const productOrder: Ref<IProductOrder> = ref(new ProductOrder());

    const productService = inject('productService', () => new ProductService());

    const products: Ref<IProduct[]> = ref([]);

    const shoppingCartService = inject('shoppingCartService', () => new ShoppingCartService());

    const shoppingCarts: Ref<IShoppingCart[]> = ref([]);
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'en'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveProductOrder = async productOrderId => {
      try {
        const res = await productOrderService().find(productOrderId);
        productOrder.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.productOrderId) {
      retrieveProductOrder(route.params.productOrderId);
    }

    const initRelationships = () => {
      productService()
        .retrieve()
        .then(res => {
          products.value = res.data;
        });
      shoppingCartService()
        .retrieve()
        .then(res => {
          shoppingCarts.value = res.data;
        });
    };

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      quantity: {
        required: validations.required(t$('entity.validation.required').toString()),
        integer: validations.integer(t$('entity.validation.number').toString()),
        min: validations.minValue(t$('entity.validation.min', { min: 0 }).toString(), 0),
      },
      totalPrice: {
        required: validations.required(t$('entity.validation.required').toString()),
        min: validations.minValue(t$('entity.validation.min', { min: 0 }).toString(), 0),
      },
      product: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      cart: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
    };
    const v$ = useVuelidate(validationRules, productOrder as any);
    v$.value.$validate();

    return {
      productOrderService,
      alertService,
      productOrder,
      previousState,
      isSaving,
      currentLanguage,
      products,
      shoppingCarts,
      v$,
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.productOrder.id) {
        this.productOrderService()
          .update(this.productOrder)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('boutiqueApp.productOrder.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.productOrderService()
          .create(this.productOrder)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('boutiqueApp.productOrder.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
