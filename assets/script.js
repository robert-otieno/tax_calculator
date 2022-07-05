let calculateBtn = document.querySelector("#calculate-tax");

calculateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let deduct_nssf = document.querySelector('input[name="deduct_nssf"]:checked').value;
    let deduct_nhif = document.querySelector('input[name="deduct_nhif"]:checked').value;
    let pay_period = document.querySelector('input[name="pay_period"]:checked').value;
    let nssf_rates = document.querySelector('input[name="nssf_rates"]:checked').value;
    let basic_salary = document.querySelector('#basic_salary').value;
    let benefits = document.querySelector('#benefits').value;

    processInput(basic_salary, pay_period, benefits, nssf_rates, deduct_nhif, deduct_nssf);
})

class PAYE {
    income_tax_band;

    constructor(basic_salary, pay_period) {
        this.basic_salary = basic_salary;
        this.pay_period = pay_period;
        this.income_tax_band;
    }
    getPAYE() {
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
        return this.basic_salary * this.income_tax_band;
    }
}

class NHIF {
    contribution;

    constructor(basic_salary) {
        this.basic_salary = basic_salary;
        this.contribution;
    }
    getContribution() {
        switch (true) {
            case this.basic_salary > 1000 && this.basic_salary <= 5999:
                this.contribution = 150;
                break;
            case this.basic_salary <= 7999:
                this.contribution = 300;
                break;
            case this.basic_salary <= 11999:
                this.contribution = 400;
                break;
            case this.basic_salary <= 14999:
                this.contribution = 500;
                break;
            case this.basic_salary <= 19999:
                this.contribution = 600;
                break;
            case this.basic_salary <= 24999:
                this.contribution = 750;
                break;
            case this.basic_salary <= 29999:
                this.contribution = 850;
                break;
            case this.basic_salary <= 34999:
                this.contribution = 900;
                break;
            case this.basic_salary <= 39999:
                this.contribution = 950;
                break;
            case this.basic_salary <= 44999:
                this.contribution = 1000;
                break;
            case this.basic_salary <= 49999:
                this.contribution = 1100;
                break;
            case this.basic_salary <= 59999:
                this.contribution = 1200;
                break;
            case this.basic_salary <= 69999:
                this.contribution = 1300;
                break;
            case this.basic_salary <= 79999:
                this.contribution = 1400;
                break;
            case this.basic_salary <= 89999:
                this.contribution = 1500;
                break;
            case this.basic_salary <= 99999:
                this.contribution = 1600;
                break;
            case this.basic_salary >= 100000:
                this.contribution = 1700;
                break;
            default:
                this.contribution = 500;
                break;
        }
        return this.contribution;
    }
}

class NSSF {
    #employeeContribution;
    #employerContribution;
    pensionContribution;

    constructor(basic_salary) {
        this.basic_salary = basic_salary;
        this.#employeeContribution;
        this.#employerContribution;
        this.pensionContribution;
    }
    getNSSF() {
        // To deduct NSSF or Not to Deduct
        switch (this.deduct_nssf) {
            // If "Yes"
            case 'yes':
                this.pensionContribution = this.#calculateEmployeeContribution() + this.#calculateEmployerContribution();
                break;
            case 'no':
                this.pensionContribution = 0;
                break;
            default:
                this.pensionContribution = 400;
                break;
        }
        return this.pensionContribution;
    }
    #calculateEmployeeContribution() {
        // Calculate employees contribution from the salary inclusive of wages
        return this.#employeeContribution = 0.06 * this.basic_salary;
    }
    #calculateEmployerContribution() {
        // Calculate the employers contribution
        // Check if basic_salary is between 6000 and 18000
        if (this.basic_salary > 6000 && this.basic_salary <= 18000) {
            this.#employerContribution = 0.06 * this.basic_salary
            // Check if basic_salary is greater than 18000
        } else if (this.basic_salary > 18000 && 0.06 * this.basic_salary >= 2160) {
            // Employer contribution limit is 2160
            this.#employerContribution = 2160;
        } else {
            // Employer contribution if less than 2160
            this.#employerContribution = 0.06 * this.basic_salary;
        }
        return this.#employerContribution;
    }
}

// Render To Console
const processInput = (basic_salary, pay_period, benefits, nssf_rates, deduct_nhif, deduct_nssf) => {

    let myPAYE = new PAYE(basic_salary, benefits, pay_period);

    let myNHIF = new NHIF(basic_salary, deduct_nhif, pay_period);

    let myNSSF = new NSSF(basic_salary, pay_period, nssf_rates, deduct_nssf);
}

const processOutput = () => {
    // console.log(`PAYE: ${myPAYE.getPAYE()}`);
    // console.log(`NHIF: ${myNHIF.getContribution()}`);
    // console.log(`NSSF: ${myNSSF.getNSSF()}`);
    console.log(`Output: Processing...`)
}

processOutput();