document.querySelector("#calculate-tax").addEventListener("click", (e) => {
    e.preventDefault();
    let deduct_nssf = document.querySelector('input[name="deduct_nssf"]:checked').value;
    let deduct_nhif = document.querySelector('input[name="deduct_nhif"]:checked').value;
    let pay_period = document.querySelector('input[name="pay_period"]:checked').value;
    let nssf_rates = document.querySelector('input[name="nssf_rates"]:checked').value;
    let basic_salary = document.querySelector('#basic_salary').value;
    let benefits = document.querySelector('#benefits').value;

    processInput(basic_salary, pay_period, benefits, nssf_rates, deduct_nhif, deduct_nssf);
})

class PayPeriod {
    constructor(pay_period) {
        this.pay_period = pay_period;
    }
    getPayPeriod() {
        let $pay_period;
        switch (this.pay_period) {
            case "month":
                $pay_period = 1;
                break;

            case "year":
                $pay_period = 12;
                break;
        }
        return $pay_period;
    }
}

class NHIF {
    contribution;
    constructor(basic_salary, deduct_nhif) {
        this.basic_salary = basic_salary;
        this.deduct_nhif = deduct_nhif;
        this.contribution;
    }
    nhifContribution() {
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
                case "self employed":
                    this.contribution = 500;
                    break;
            }
        } else {
            this.contribution = 0;
        }
        return this.contribution;
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

class PAYE extends PayPeriod {
    income_tax_band;
    constructor(basic_salary, benefits, pay_period, nssf_rates, deduct_nssf, deduct_nhif) {
        super(pay_period);
        this.basic_salary = basic_salary;
        this.benefits = benefits;
        this.nssf_rates = nssf_rates;
        this.deduct_nssf = deduct_nssf;
        this.deduct_nhif = deduct_nhif;

        this.NSSF = new NSSF(this.basic_salary, this.nssf_rates, this.deduct_nssf);
        this.NHIF = new NHIF(this.basic_salary, this.deduct_nhif);
        this.personal_relief = personalRelief(pay_period);

        this.income_tax_band;
    }

    /**
     * taxable_income = basic_salary + benefits - contributions
     * @returns taxable_income
     */
    taxableIncome() {
        return (parseFloat(this.basic_salary) + parseFloat(this.benefits) - this.NSSF.getNSSF() - this.NHIF.nhifContribution()) * this.getPayPeriod();
    }

    getNHIF() {
        return this.NHIF.nhifContribution() * this.getPayPeriod();
    }

    taxOnTaxableIncome() {
        return this.taxableIncome() * this.#incomeTaxBand();
    }

    _paye() {
        return this.taxOnTaxableIncome() - this.personal_relief * this.getPayPeriod();
    }

    /**
     * Calculate income_tax_band by checking for the payPeriod() and the taxableIncome()
     * @returns income_tax_band
     */
    #incomeTaxBand() {
        if (this.getPayPeriod() === 1 && this.taxableIncome() <= 12298 || this.getPayPeriod() === 12 && this.taxableIncome() <= 147580) {
            return 0.1;
        } else if (this.getPayPeriod() === 1 && this.taxableIncome() <= 23885 || this.getPayPeriod() === 12 && this.taxableIncome() <= 286623) {
            return 0.15;
        } else if (this.getPayPeriod() === 1 && this.taxableIncome() <= 35472 || this.getPayPeriod() === 12 && this.taxableIncome() <= 425666) {
            return 0.2;
        } else if (this.getPayPeriod() === 1 && this.taxableIncome() <= 47059 || this.getPayPeriod() === 12 && this.taxableIncome() <= 564709) {
            return 0.25;
        } else if (this.getPayPeriod() === 1 && this.taxableIncome() > 47059 || this.getPayPeriod() === 12 && this.taxableIncome() > 564709) {
            return 0.3;
        }
    }
}

const processInput = (basic_salary, pay_period, benefits, nssf_rates, deduct_nhif, deduct_nssf) => {

    let myPAYE = new PAYE(basic_salary, benefits, pay_period, nssf_rates, deduct_nssf, deduct_nhif);

    // Income Before Pension Deduction
    document.querySelector('#income_before_nssf_deduction').innerHTML = `Ksh. ${parseFloat(basic_salary).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // NSSF Contribution
    document.querySelector('#nssf').innerHTML = `Ksh. ${myNSSF.getNSSF().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Income After Pension Deductions
    document.querySelector('#income_after_nssf_deduction').innerHTML = `Ksh. ${(basic_salary - myNSSF.getNSSF()).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Benefits in Kind
    document.querySelector('#benefits_in_kind').innerHTML = `Ksh. ${parseFloat(benefits).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Taxable Income
    document.querySelector('#taxable_income').innerHTML = `Ksh. ${myPAYE.taxableIncome().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Tax on Taxable Income
    document.querySelector('#tax_on_taxable_income').innerHTML = `Ksh. ${myPAYE.taxOnTaxableIncome().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Personal Relief
    document.querySelector('#personal_relief').innerHTML = `Ksh. ${(personalRelief(pay_period)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Tax Net Off Relief
    document.querySelector('#tax_net_off_relief').innerHTML = `Ksh. ${myPAYE._paye().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // PAYE
    document.querySelector('#paye').innerHTML = `Ksh. ${myPAYE._paye().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Chargable Income
    document.querySelector('#chargable_income').innerHTML = `Ksh. ${myPAYE.taxableIncome().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // NHIF Contribution
    document.querySelector('#nhif').innerHTML = `Ksh. ${myNHIF.nhifContribution().toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    // Net Pay
    document.querySelector('#net_pay').innerHTML = `Ksh. ${(parseFloat(basic_salary) - myNHIF.nhifContribution() - myNSSF.getNSSF() - myPAYE._paye()).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}