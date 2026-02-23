type SpinnerProps = {
  style?: React.CSSProperties,
  colorBackground?: string
};


export function Spinner({ style, colorBackground }: SpinnerProps) {
  return <div style={{...styles.spinner, ...style, border: colorBackground ? (`4px solid ${colorBackground}`) : "4px solid rgba(255,255,255,0.3)", borderTop: "4px solid #fff"}} />;
}


const styles: Record<string, React.CSSProperties> = {
  spinner: {
    width: "30px",
    height: "30px",
    // border: "4px solid rgba(255,255,255,0.3)",
    // border: "4px solid var(--color-confirm)",
    // borderTop: "4px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block", // 🔥 importante
  },
};