"use client";
const ButtonSpinner = ({ color = "#fff" }: { color?: string }) => {
  return (
    <div style={{ color }} className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default ButtonSpinner;
