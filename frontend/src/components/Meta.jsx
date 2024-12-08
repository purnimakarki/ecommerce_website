import { Helmet } from "react-helmet-async";

function Meta({
  title = "Welcome to Purnimas Ecommerce",
  description = "Test description",
  kewyords = "ecommerce,purnimas,shop,buy,sell,buy and sell",
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={kewyords} />
    </Helmet>
  );
}

export default Meta;
