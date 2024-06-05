import { defineComponent, inject, onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import ProductOrderService from './product-order.service';
import { type IProductOrder } from '@/shared/model/product-order.model';
import { useAlertService } from '@/shared/alert/alert.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ProductOrder',
  setup() {
    const { t: t$ } = useI18n();
    const productOrderService = inject('productOrderService', () => new ProductOrderService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const productOrders: Ref<IProductOrder[]> = ref([]);

    const isFetching = ref(false);

    const clear = () => {};

    const retrieveProductOrders = async () => {
      isFetching.value = true;
      try {
        const res = await productOrderService().retrieve();
        productOrders.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveProductOrders();
    };

    onMounted(async () => {
      await retrieveProductOrders();
    });

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: IProductOrder) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeProductOrder = async () => {
      try {
        await productOrderService().delete(removeId.value);
        const message = t$('boutiqueApp.productOrder.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveProductOrders();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    return {
      productOrders,
      handleSyncList,
      isFetching,
      retrieveProductOrders,
      clear,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeProductOrder,
      t$,
    };
  },
});
