import { ClipLoader } from "react-spinners";

interface LoaderProps {
  size: number;
  color: string;
}

const Loader = ({ size, color }: LoaderProps) => {
  console.log(size, color);
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <ClipLoader color="#16bfd1" size={50} />
      <p className="">Loading...</p>
    </div>
  );
};

export default Loader;
