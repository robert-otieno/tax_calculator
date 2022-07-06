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

    constructor(basic_salary, deduct_nhif, pay_period) {
        this.basic_salary = basic_salary;
        this.deduct_nhif = deduct_nhif;
        this.pay_period = pay_period;
        this.contribution;
    }
    getNHIF() {
        if (this.deduct_nhif === "yes") {
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
        } else {
            this.contribution = 0;
        }

        if (this.pay_period === "month") {
            return this.contribution;
        } else {
            return this.contribution * 12;
        }
    }
}

class NSSF {
    #oldNSSFRatesEmployeeContribution = 200;
    #oldNSSFRatesEmployerContribution = 200;
    Deductible_NSSF_Pension_Contribution;
    constructor(basic_salary, pay_period, nssf_rates, deduct_nssf) {
        this.basic_salary = basic_salary;
        this.pay_period = pay_period;
        this.nssf_rates = nssf_rates;
        this.deduct_nssf = deduct_nssf;

        this.#oldNSSFRatesEmployeeContribution;
        this.#oldNSSFRatesEmployerContribution;
        this.Deductible_NSSF_Pension_Contribution;
    }
    getNSSF() {
        // To deduct NSSF or Not to Deduct
        switch (this.deduct_nssf) {
            // If "Yes"
            case 'yes':
                switch (this.nssf_rates) {
                    // New NSSF_RATES
                    case "new":
                        switch (this.pay_period) {
                            case "month":
                                this.Deductible_NSSF_Pension_Contribution = this.#calculateNewEmployeeContribution();
                                break;

                            case "year":
                                this.Deductible_NSSF_Pension_Contribution = (this.#calculateNewEmployeeContribution()) * 12;
                                break;
                        }
                        break;
                    // Old NSSF_RATES
                    default:
                        switch (this.pay_period) {
                            case "month":
                                this.Deductible_NSSF_Pension_Contribution = this.#oldNSSFRatesEmployeeContribution;
                                break;

                            case "year":
                                this.Deductible_NSSF_Pension_Contribution = (this.#oldNSSFRatesEmployeeContribution) * 12;
                                break;
                        }
                        break;
                }
                break;
            // If "No"
            default:
                this.Deductible_NSSF_Pension_Contribution = 0;
                break;
        }
        return this.Deductible_NSSF_Pension_Contribution;
    }

    /**
     * Calculate employees contribution from the salary inclusive of wages
     * @returns 
     */
    #calculateNewEmployeeContribution() {
        return 0.06 * this.basic_salary;
    }

    /**
     * Calculate the employers contribution
     * Check if basic_salary is between 6000 and 18000
     * Check if basic_salary is greater than 18000
     * Employer contribution limit is 2160
     * @returns employerContribution
     */
    #calculateNewEmployerContribution() {
        if (this.basic_salary > 6000 && this.basic_salary <= 18000 || 0.06 * this.basic_salary < 2160) {
            return 0.06 * this.basic_salary
        } else {
            return 2160;
        }
    }
}

const personalRelief = (pay_period) => {
    let relief;
    switch (pay_period) {
        case "month":
            relief = 2400;
            break;
    
        case "year":
            relief = 28800;
            break;
    }
    return relief;
}

/**
 * 
 * @param {*} basic_salary {220,000}
 * @param {*} pay_period {month}
 * @param {*} benefits {0}
 * @param {*} nssf_rates {old}
 * @param {*} deduct_nhif {yes}
 * @param {*} deduct_nssf {yes}
 */
const processInput = (basic_salary, pay_period, benefits, nssf_rates, deduct_nhif, deduct_nssf) => {

    let myPAYE = new PAYE(basic_salary, benefits, pay_period);
    let myNHIF = new NHIF(basic_salary, deduct_nhif, pay_period);
    let myNSSF = new NSSF(basic_salary, pay_period, nssf_rates, deduct_nssf);
    // Income Before Pension Deduction
    document.querySelector('#income_before_nssf_deduction').innerHTML = `Ksh. ${parseFloat(basic_salary).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // NSSF Contribution
    document.querySelector('#nhif').innerHTML = `Ksh. ${myNHIF.getNHIF().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Income After Pension Deductions
    document.querySelector('#income_after_nssf_deduction').innerHTML = `Ksh. ${(basic_salary - myNSSF.getNSSF()).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Benefits in Kind
    document.querySelector('#benefits_in_kind').innerHTML = `Ksh. ${parseFloat(benefits).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Taxable Income
    document.querySelector('#taxable_income').innerHTML = `Ksh. ${(parseFloat(basic_salary) + parseFloat(benefits) - myNSSF.getNSSF()).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Tax on Taxable Income
    document.querySelector('#tax_on_taxable_income').innerHTML = `Ksh. ${myPAYE.getPAYE().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Personal Relief
    document.querySelector('#personal_relief').innerHTML = `Ksh. ${(personalRelief(pay_period)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Tax Net Off Relief
    document.querySelector('#tax_net_off_relief').innerHTML = `Ksh. ${(myPAYE.getPAYE() - personalRelief(pay_period)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // PAYE
    document.querySelector('#paye').innerHTML = `Ksh. ${myPAYE.getPAYE().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Chargable Income
    document.querySelector('#chargable_income').innerHTML = `Ksh. ${(parseFloat(basic_salary) + parseFloat(benefits) - myNSSF.getNSSF()).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // NHIF Contribution
    document.querySelector('#nssf').innerHTML = `Ksh. ${myNSSF.getNSSF().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Net Pay
    document.querySelector('#net_pay').innerHTML = `Ksh. ${(parseFloat(basic_salary) - myNHIF.getNHIF() - myNSSF.getNSSF() - myPAYE.getPAYE()).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}