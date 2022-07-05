// Constructor Function
// class Circle {
//     constructor(radius) {
//         this.radius = radius;
//         this.draw = function () {
//             console.log('drawing circle');
//         };
//     circumference() {
//         return 2 * 3.142 * this.radius;
//     }
//     }
// }
// let myCircle = new Circle(4);
// console.log(`My Circle circumference: ${myCircle.circumference()}`)



class Paye {
    income_tax_band;
    personal_relief;
    constructor(basic_salary, pay_period) {
        this.basic_salary = basic_salary;
        this.pay_period = pay_period;
        this.income_tax_band;
        this.personal_relief;
    }
    getPaye() {
        if (this.pay_period === 'month' && this.basic_salary <= 12298 || this.pay_period === 'year' && this.basic_salary <= 147580) {
            this.income_tax_band = 0.1;
        } else if (this.pay_period === 'month' && this.basic_salary <= 23885 || this.pay_period === 'year' && this.basic_salary <= 286623) {
            this.income_tax_band = 0.15;
        } else if (this.pay_period === 'month' && this.basic_salary <= 35472 || this.pay_period === 'year' && this.basic_salary <= 425666) {
            this.income_tax_band = 0.2;
        } else if (this.pay_period === 'month' && this.basic_salary <= 47059 || this.pay_period === 'year' && this.basic_salary <= 564709) {
            this.income_tax_band = 0.25;
        } else if (this.pay_period === 'month' && this.basic_salary > 47059 || this.pay_period === 'year' && this.basic_salary > 564709) {
            this.income_tax_band = 0.3;
        }

        if (this.pay_period === 'month') {
            this.personal_relief = 2400;
        } else {
            this.personal_relief = 28800;
        }
        return this.basic_salary * this.income_tax_band - this.personal_relief;
    }
}

let myPaye = new Paye(40000, 'year');
console.log(`PAYE: ${myPaye.getPaye()}`);