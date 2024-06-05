import { defineComponent, inject, onMounted, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import ShoppingCartService from './shopping-cart.service';
import { type IShoppingCart } from '@/shared/model/shopping-cart.model';
import { useDateFormat } from '@/shared/composables';
import { useAlertService } from '@/shared/alert/alert.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'ShoppingCart',
  setup() {
    const { t: t$ } = useI18n();
    const dateFormat = useDateFormat();
    const shoppingCartService = inject('shoppingCartService', () => new ShoppingCartService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const shoppingCarts: Ref<IShoppingCart[]> = ref([]);

    const isFetching = ref(false);

    const clear = () => {};

    const retrieveShoppingCarts = async () => {
      isFetching.value = true;
      try {
        const res = await shoppingCartService().retrieve();
        shoppingCarts.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveShoppingCarts();
    };

    onMounted(async () => {
      await retrieveShoppingCarts();
    });

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: IShoppingCart) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeShoppingCart = async () => {
      try {
        await shoppingCartService().delete(removeId.value);
        const message = t$('boutiqueApp.shoppingCart.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveShoppingCarts();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    return {
      shoppingCarts,
      handleSyncList,
      isFetching,
      retrieveShoppingCarts,
      clear,
      ...dateFormat,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeShoppingCart,
      t$,
    };
  },
});
