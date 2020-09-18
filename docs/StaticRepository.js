class StaticRepository extends Repository {
    constructor(initParamObject) {
        super(initParamObject);
        this.items = initParamObject.items;
    }
};