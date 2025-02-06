import { trimAll } from '@/dy_next_utils/utils/formats/trimAll';
import { isMobile, isStartWithTel } from '@/dy_next_utils/utils/rep';
import { separateTel } from '@/dy_next_utils/utils/formats/separateTel';
import EvInput from '../Evinput';

interface PhoneInputProps {
  stepNum: number;
  phone: string;
  setPhone: (phone: string) => void;
  onFocus: () => void;
}

const PhoneInput = ({ stepNum, phone, setPhone, onFocus }: PhoneInputProps) => {
  return (
    <div className={'flexrc relative justify-between w-full'}>
      <EvInput
        type="tel"
        onFocus={onFocus}
        maxLength={13}
        placeholder="请输入领取权益的手机号码"
        validate={(val) => {
          if (trimAll(val).length === 0) {
            return '';
          } else if (!isStartWithTel(trimAll(val))) {
            return '请输入正确的手机号码';
          } else if (trimAll(val).length === 11 && !isMobile(trimAll(val))) {
            return '请输入正确的手机号码';
          }
          return '';
        }}
        value={phone}
        onClear={() => {
          setPhone && setPhone('');
        }}
        onValueChange={(val) => {
          if (trimAll(val).length > 11) {
            console.log('手机号码长度不能超过11位');
            return;
          }
          // 只能输入数字和空格
          if (/^[0-9 ]*$/.test(val) || val === '') {
            setPhone && setPhone(separateTel(val));
          }
        }}
      />
    </div>
  );
};

export default PhoneInput;
