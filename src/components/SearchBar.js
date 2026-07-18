import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FaSearch } from "react-icons/fa";

function SearchBar({ search, setSearch }) {
  return (
    <InputGroup className="mb-5 shadow-sm">
      <InputGroup.Text className="bg-white">
        <FaSearch />
      </InputGroup.Text>
      <Form.Control
        placeholder="Search latest News.."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-start-0"
      />
    </InputGroup>
  );
}

export default SearchBar;