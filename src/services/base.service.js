export default class BaseService {
  constructor(model) {
    this.model = model;
  }

  async findById(id) {
    return this.model.query().findById(id);
  }

  async findByIds(ids) {
    return this.model.query().whereIn('id', ids);
  }

  async findAll(first = 100, offset = 1, orderBy = {}) {
    const { field = '', direction = 'asc' } = orderBy;

    let query = this.model.query();

    if (field) {
      query = query.orderBy(field, direction);
    }

    return query;
  }
}
