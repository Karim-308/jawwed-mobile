import { CalculationMethod, Madhab } from 'adhan';

export const getCalculationMethodParam = (calculationMethod) => {
    if(calculationMethod === 'رابطة العالم الإسلامي')
        return CalculationMethod.MuslimWorldLeague();
    else if(calculationMethod === 'الهيئة العامة المصرية للمساحة')
        return CalculationMethod.Egyptian();
    else if(calculationMethod === 'مكة - أم القرى')
        return CalculationMethod.UmmAlQura();
    
};

export const getMazhabParam = (mazhab) => {
    if(mazhab === 'حنفي')
        return Madhab.Hanafi;
    else
        return Madhab.Shafi;
};