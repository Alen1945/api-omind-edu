module.exports = (req, params, countData) => {
  const totalPages = Math.ceil(countData / parseInt(params.perPage));
  const query = req.query;
  query.page = parseInt(params.currentPage) + 1;
  const nextPage = parseInt(params.currentPage) < totalPages;
  query.page = parseInt(params.currentPage) - 1;
  const previousPage = parseInt(params.currentPage) > 1;
  return {
    currentPage: params.currentPage,
    nextPage,
    previousPage,
    totalPages,
    perPage: params.perPage,
    totalEntries: countData,
  };
};
