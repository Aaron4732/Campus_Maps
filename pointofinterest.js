class PointOfInterest {
    constructor(poiId, name, location) {
      this.poiId = poiId;
      this.name = name;
      this.location = location;
    }
  
    getPOIName() {
      return this.name;
    }
  
    getLocation() {
      return this.location;
    }
  }
  