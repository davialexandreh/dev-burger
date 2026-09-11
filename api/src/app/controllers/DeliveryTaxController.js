import { DELIVERY_TAX } from '../../config/delivery.js';

class DeliveryTaxController {
  async index(request, response) {
    return response.json({ deliveryTax: DELIVERY_TAX });
  }
}

export default new DeliveryTaxController();
