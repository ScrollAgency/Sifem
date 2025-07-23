import { useLesionOptionContext } from "../../../contexts/LesionOptionContext";
import CheckboxSvg from './Checkbox.svg';

export function LesionsList({
  columnCondition,
  stepCondition,
  itemClassName,
  checkboxClassName,
  labelClassName,
  listClassName,
  checkboxSvg: CheckboxSvgComponent = CheckboxSvg,
}: {
  columnCondition?: string;
  stepCondition?: string;
  itemClassName?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  listClassName?: string;
  checkboxSvg?: React.ReactNode;
}) {
  const { lesions } = useLesionOptionContext();

  const filteredLesions =
    columnCondition && stepCondition
      ? lesions.filter((l) =>
          String((l as any)[columnCondition]) === stepCondition
        )
      : lesions;

  return (
    <ul className={listClassName}>
      {filteredLesions.map((l) => (
        <li key={l.id} className={itemClassName}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {CheckboxSvgComponent ? (
              <div className={checkboxClassName}>
                {CheckboxSvgComponent}
              </div>
            ) : (
              <input type="checkbox" className={checkboxClassName} />
            )}
            <span className={labelClassName}>{l.name_fr}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

export default LesionsList;
