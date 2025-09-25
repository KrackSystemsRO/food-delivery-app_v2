import { DatePickerModal } from "react-native-paper-dates";

type Props = {
  date: Date;
  onSelectDate: (date: Date) => void;
  visible: boolean;
  onDismiss: () => void;
};

export default function DatePicker({
  date,
  onSelectDate,
  visible,
  onDismiss,
}: Props) {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  return (
    <>
      <DatePickerModal
        locale="ro"
        mode="single"
        visible={visible}
        date={date}
        validRange={{ startDate: thirtyDaysAgo, endDate: today }}
        onDismiss={onDismiss}
        onConfirm={(params) => {
          onDismiss();
          if (params.date) onSelectDate(params.date);
        }}
      />
    </>
  );
}
