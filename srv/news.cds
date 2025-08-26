namespace srv;

@path: '/catalog/news'
service NewsImportService {


type Article {
  sourceId    : String;
  sourceName  : String;
  author      : String;
  title       : String;
  description : String;
  url         : String;
  urlToImage  : String;
  publishedAt : String;
  content     : String;
};

 type ArticlesResponse {
  status       : String;
  totalResults : Integer;
  articles     : many Article not null;
};

function Articles(
  q        : String,
  fromDate : String,
  sortBy   : String,
  language : String,
  page     : Integer,
  pageSize : Integer
) returns ArticlesResponse;

  /** Basit test için function */
  function hello(name : String) returns String;
}
