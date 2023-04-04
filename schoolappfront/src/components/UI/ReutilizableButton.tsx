import Button from "@mui/material/Button/Button";

const styles: any = (theme: any) => ({
  disabledButton: {
    backgroundColor: theme.palette.primary || "red",
  },
});

const ReutilizableButton = ({ ...props }) => {
  return (
    <Button
      variant="contained"
      color={props.color}
      type={props.type}
      size="large"
      sx={{ width: "25%", marginTop: 5 }}
      disabled={!props.disabled}
    >
      {props.children}
    </Button>
  );
};

export default ReutilizableButton;
