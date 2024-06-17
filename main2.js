const alpha = 3/19;
const beta = 8/11;
const targetEps = 1e-14;
const target = Math.PI/3;
const multiplyer = 4/3;
const nAlpha = 21;
const nBeta = 21;
const u = Number.EPSILON/2;

const pow = (x, power) => {
    let result = 1;

    if (power > 0) {
        for (let i = 0; i < power; i++) { 
            result *= x;
        }
    }

    return result;
}

// заполнение массивов C и X
function fillArrays(x, n) {
    const X = [];
    const C = [];

    for (let k = 1; k <= n+1; k++) {
        const sign = (k % 2 === 0 ? -1 : 1);
        const power = 2 * k - 1;

        const cTerm = sign * (1 / power);
        const xTerm = pow(x, power);

        C.push(cTerm);
        X.push(xTerm);
    }

    return [ X, C ]
}

// скалярное произведение
const calcScalar = (C, X) => {
    const n = C.length;
    let sum = 0;
    let nu = 0;
    
    for (let i = 0; i < n; i++) {
        const product = C[i] * X[i];
        sum += product;
        nu += Math.abs(sum) + Math.abs(product);
    }

    nu *= u;
    nu /= (1 - (2*n + 1) * u);

    return [ sum, nu ];
}

// остаточная ошибка
const marginEstimateError = (C, X) => {
    const n = C.length - 1;
    return Math.abs(C[n] * X[n]) / (1 - (4*n - 1)*u);
}

// |cx - c^x^|
const empericalErrorEstimate = (C, X) => {
    const n = C.length-1;
    let nuModul = 0;
    let sum = 0;

    for (let i = 0; i < n; i++) {
        const productModul = Math.abs(C[i]) * Math.abs(X[i]);
        sum += productModul;
        nuModul += Math.abs(sum) + Math.abs(productModul);
    }

    nuModul *= u;
    nuModul /= (1 - (2*n + 1) * u);

    return (nuModul + sum) * gamma((4 * n) - 2);
}

const gamma = (n) => (n * u) / (1 - n * u);

const estimateErrorSum = (errors) => {
    let nu = 0;
    let errSum = 0;
    const n = errors.length;

    for (let i = 0; i < n; i++) {
        errSum += errors[i];
        nu += Math.abs(errSum);
    }

    nu *= u;
    nu /= (1 - (n + 1) * u);

    return (errSum + nu) / (1 - 2 * u);
}

const [ xAlpha, cAlpha ] = fillArrays(alpha, nAlpha);
const [ xBeta, cBeta ] = fillArrays(beta, nBeta);

const [sumAlpha, scalarAlphaErr] = calcScalar(cAlpha, xAlpha);
const [sumBeta, scalarBetaErr] = calcScalar(cBeta, xBeta);

const empiricalAlphaErr = empericalErrorEstimate(cAlpha, xAlpha);
const empiricalBetaErr = empericalErrorEstimate(cBeta, xAlpha);

const marginAlphaErr = marginEstimateError(cAlpha, xAlpha);
const marginBetaErr = marginEstimateError(cBeta, xBeta);

const alphaErr = estimateErrorSum([scalarAlphaErr, empiricalAlphaErr, marginAlphaErr]);
const betaErr = estimateErrorSum([scalarBetaErr, empiricalBetaErr, marginBetaErr]);

const overAllError = estimateErrorSum([alphaErr, betaErr]);

const piOver4 = sumAlpha + sumBeta;

const answerSum = multiplyer * piOver4;
const answerErr = multiplyer * overAllError;

console.log(answerSum);
console.log(answerErr);