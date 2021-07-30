/**
 * Clase helper para actualizar los datos al nerdlet
 */
export default class Emulator {
  constructor(data, kpis) {
    this.data = data;
    this.kpis = kpis;
    this.firstLoad = true;
    this.accountId = 1211212;
    console.log('KPIS',kpis);
  }

  init = () => {
    this._fetchLevels();
    this._fetchCapacities();
    this._fetchErrors();
    this.firstLoad = false;
    this.intervalLevel = setInterval(() => {
      this._fetchLevels();
    }, 3000);
    this.intervalCapacity = setInterval(() => {
      this._fetchCapacities();
    }, 3000);
    this.intervalCapacity = setInterval(() => {
      this._fetchErrors();
    }, 10000);
  };

  getDataState = () => {
    return this.data;
  };

  getKpis() {
    for(let i=0;i<this.kpis.length;i++){
      if(this.kpis[i].type === 101){
        this.kpis[i].value ={
          current: Math.floor(Math.random() * (10000)),
          previous: Math.floor(Math.random() * (10000))
        };
      }else{
        this.kpis[i].value = Math.floor(Math.random() * (10000));
      }
    }
    return this.kpis;
  }

  closeConnections() {
    clearInterval(this.intervalLevel);
    clearInterval(this.intervalCapacity);
    clearInterval(this.intervalErrors);
  }

  _ramdomHighLight = () => {
    const highlightOptions = [
      false,
      false,
      false,
      false,
      'red',
      false,
      false,
      false
    ];
    return highlightOptions[
      Math.floor(Math.random() * highlightOptions.length)
    ];
  };

  _randomIntFromInterval = (min, max, actualValue) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    let rand = Math.floor(Math.random() * (max - min + 1)) + min;
    let res = actualValue + rand - Math.round((max - min) / 2);
    if (res < 1) {
      return 1;
    } else if (res >= 100 && actualValue !== 0) {
      rand = Math.floor(Math.random() * (max - min + 1)) + min;
      res = actualValue - rand - Math.round((max - min) / 2);
      return res;
    } else {
      return res;
    }
  };

  _randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    return rand;
  };

  _randomWithArrayOfNumbers = (n, quantityNumbers) => {
    const arr = new Array(n);
    for (let i = 0; i < n; i++) {
      arr[i] = i + 1;
    }
    arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
    return arr.slice(0, quantityNumbers);
  };

  _fetchCapacities = () => {
    for (const stage of this.data) {
      const update = this.firstLoad
        ? true
        : this._randomIntFromInterval(1, 25, 50) < 80;
      if (update) {
        if (stage.congestion.percentage > 80) {
          stage.congestion.percentage = this._randomIntFromInterval(
            1,
            15,
            Math.round(stage.congestion.percentage / 2)
          );
        } else {
          stage.congestion.percentage = this._randomIntFromInterval(
            1,
            15,
            stage.congestion.percentage
          );
        }
        stage.congestion.value = this._randomIntFromInterval(
          1,
          20,
          stage.congestion.value
        );
        stage.total_count = Math.floor(Math.random() * 900000) + 5000;
        if (stage.total_count < 0) {
          stage.total_count = 0;
        }
        stage.capacity = this._randomIntFromInterval(1, 20, stage.capacity);
      }
    }
  };

  _fetchLevels = () => {
    for (const stage of this.data) {
      const update = this.firstLoad
        ? true
        : this._randomIntFromInterval(1, 25, 50) < 80;
      if (update) {
        stage.gout_quantity = this._randomIntFromInterval(1, 15, stage.gout_quantity);
        stage.gout_money = stage.gout_quantity*125;
      }
    }
  };

  _fetchErrors = () => {
    const update = this.firstLoad
      ? true
      : this._randomIntFromInterval(1, 25, 50) < 80;
    if (update) {
      for (const key in this.data) {
        if (key) {
          const newSteps = [];
          const number = this._randomInt(1, 20);
          const exist = this.data[key].touchpoints.find(
            touchpoint => touchpoint.index === number
          );
          if (exist) {
            this.resetSpecificStage(key);
            this.data[key].touchpoints[exist.index - 1].error = true;
            for (const step of this.data[key].steps) {
              if (step.value === '') {
                for (const substep of step.sub_steps) {
                  for (const relation of substep.relationship_touchpoints) {
                    if (relation === exist.index) {
                      substep.error = true;
                    }
                  }
                }
                step.error = true;
                // step.sub_steps = step.sub_steps;
              } else {
                for (const relationS of step.relationship_touchpoints) {
                  if (relationS === exist.index) {
                    step.error = true;
                  }
                }
              }
              newSteps.push(step);
            }
            this.data[key].steps = newSteps;
          }
        }
      }
    }
  };

  resetSpecificStage = key => {
    for (const step of this.data[key].steps) {
      if (step.value === '') {
        for (const substep of step.sub_steps) {
          substep.error = false;
        }
        step.error = false;
      } else {
        step.error = false;
      }
    }
    for (const touch of this.data[key].touchpoints) {
      touch.error = false;
    }
  };
}
