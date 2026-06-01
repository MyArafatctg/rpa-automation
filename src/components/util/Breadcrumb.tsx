interface Props {
  data: string;
}
const Breadcrumb = ({ data }: Props) => {
  return <div className="text-3xl font-bold mb-6">{data}</div>;
};

export default Breadcrumb;
