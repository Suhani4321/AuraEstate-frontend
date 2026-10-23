import React, { useState } from 'react';
import { Calculator, IndianRupee, Percent, Calendar } from 'lucide-react';

export default function MortgageCalculator({ propertyPrice = 25000000, hoaFee = 0 }) {
  const [price, setPrice] = useState(propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTermYears, setLoanTermYears] = useState(20);

  const downPaymentAmount = (price * downPaymentPercent) / 100;
  const loanAmount = price - downPaymentAmount;

  // Monthly mortgage calculation: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  let monthlyPrincipalAndInterest = 0;
  if (monthlyRate > 0 && loanAmount > 0) {
    monthlyPrincipalAndInterest =
      (loanAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  const estimatedTax = (price * 0.008) / 12; // ~0.8% annual property tax
  const estimatedInsurance = (price * 0.003) / 12; // ~0.3% home insurance
  const totalMonthly = monthlyPrincipalAndInterest + estimatedTax + estimatedInsurance + Number(hoaFee);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
        <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center">
          <Calculator className="w-4 h-4 stroke-[1.6]" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-normal text-stone-950">Home Loan & EMI Estimator</h3>
          <p className="text-xs text-stone-500 font-light">Calculate estimated monthly EMI and financing expenses</p>
        </div>
      </div>

      {/* Total Monthly Highlight */}
      <div className="bg-stone-950 text-stone-100 rounded-xl p-5 text-center border border-stone-850">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
          Estimated Monthly EMI
        </span>
        <div className="font-serif text-3xl font-normal text-white mt-1">
          ₹{Math.round(totalMonthly).toLocaleString('en-IN')}
          <span className="text-xs font-light text-stone-400 ml-1">/ month</span>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-stone-700">
        <div>
          <label className="block mb-1 text-[11px] font-medium uppercase tracking-wider text-stone-500">Property Price (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-stone-400 font-sans">₹</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-none focus:border-stone-900"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-[11px] font-medium uppercase tracking-wider text-stone-500">Down Payment ({downPaymentPercent}%)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-stone-400 font-sans">₹</span>
            <input
              type="number"
              value={Math.round(downPaymentAmount)}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDownPaymentPercent(price > 0 ? Math.round((val / price) * 100) : 0);
              }}
              className="w-full pl-7 pr-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-none focus:border-stone-900"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-[11px] font-medium uppercase tracking-wider text-stone-500">Interest Rate (%)</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-none focus:border-stone-900"
            />
            <span className="absolute right-3 top-2.5 text-stone-400">%</span>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-[11px] font-medium uppercase tracking-wider text-stone-500">Loan Tenure</label>
          <select
            value={loanTermYears}
            onChange={(e) => setLoanTermYears(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-none focus:border-stone-900 bg-white"
          >
            <option value={20}>20-Year Tenure</option>
            <option value={15}>15-Year Tenure</option>
            <option value={10}>10-Year Tenure</option>
            <option value={25}>25-Year Tenure</option>
          </select>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="space-y-2.5 pt-2 border-t border-stone-100 text-xs">
        <div className="flex justify-between items-center text-stone-600 font-light">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-900 inline-block"></span>
            Monthly EMI (Principal & Interest)
          </span>
          <span className="font-medium text-stone-900">₹{Math.round(monthlyPrincipalAndInterest).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between items-center text-stone-600 font-light">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-700 inline-block"></span>
            Property Taxes (Est.)
          </span>
          <span className="font-medium text-stone-900">₹{Math.round(estimatedTax).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between items-center text-stone-600 font-light">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-400 inline-block"></span>
            Home Insurance (Est.)
          </span>
          <span className="font-medium text-stone-900">₹{Math.round(estimatedInsurance).toLocaleString('en-IN')}</span>
        </div>
        {Number(hoaFee) > 0 && (
          <div className="flex justify-between items-center text-stone-600 font-light">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-stone-600 inline-block"></span>
              Monthly Maintenance / Society Charges
            </span>
            <span className="font-medium text-stone-900">₹{Number(hoaFee).toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

    </div>
  );
}
