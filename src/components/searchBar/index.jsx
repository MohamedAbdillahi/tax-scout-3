import styled from "styled-components";
import {IoClose, IoSearch } from "react-icons/io5"
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "react-click-outside-hook";
import { useRef } from "react";
import { MoonLoader  } from "react-spinners";
import { useDebounce } from "../../hooks/debounceHooks";
import { Author} from "../books-author"

// import axios from "axios";
const SearchBarContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position:relative;
  top: -55px;
  right: 80px;
  left:218px;
  width: 24em;
  height: 3.8em;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.14);
`
const SearchInputContainer = styled.div`
  width: 100%;
  min-height: 4em;
  display: flex;
  align-items: center;
  position: relative;
  padding: 2px 15px;
`;
const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  font-size: 21px;
  color: #12112e;
  font-weight: 500;
  border-radius: 6px;
  background-color: transparent;

  &:focus {
    outline: none;
    &::placeholder {
      opacity: 0;
    }
  }

  &::placeholder {
    color: #bebebe;
    transition: all 250ms ease-in-out;
  }
`;
const SearchIcon = styled.span`
  color: #bebebe;
  font-size: 27px;
  margin-right: 10px;
  margin-top: 6px;
  vertical-align: middle;
`;

const CloseIcon = styled(motion.span)`
  position: relative;
  right: 27px;
  color: #bebebe;
  font-size: 23px;
  vertical-align: middle;
  transition: all 200ms ease-in-out;
  cursor: pointer;

  &:hover {
    color: #dfdfdf;
  }
`;
const LineSeperator = styled.span`
  display: flex;
  min-width: 100%;
  min-height: 2px;
  background-color: #d8d8d878;
`;
const SearchContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1em;
  overflow-y: auto;
`;
const containerVariants = {
  expanded: {
    height: "30em",
  },
  collapsed: {
    height: "3.8em",
  },
};
const WarningMessage = styled.span`
  color: #a1a1a1;
  font-size: 14px;
  display: flex;
  align-self: center;
  justify-self: center;
`;

const containerTransition = { type: "spring", damping: 22, stiffness: 150 };

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;


export function SearchBar() {
  const [isExpanded, setExpanded] = useState(false)
  const [clickedRef, isClickedOutside] = useClickOutside()
  const inputRef = useRef()
  const [isLoading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [authors, setAuthors] = useState([])
  const [noAuthors, setNoAuthors] = useState(false)

  const isEmpty = !authors || authors.length === 0;

  const ChangeHandler = (e) => {
      e.preventDefault()
      if (e.target.value.trim() === "") setNoAuthors(false);
      setSearchQuery(e.target.value);
  }
  const expandContainer = () => {
    setExpanded(true)
  }
  const collapseContainer = () => {
    setExpanded(false);
    setSearchQuery("");
    setLoading(false);
    setNoAuthors(false)
    setAuthors([]);
    if (inputRef.current) inputRef.current.value = "";

  }
  useEffect(() => {
    if(isClickedOutside) collapseContainer()


  }, [isClickedOutside])
  const prepareSearchTitles = (query) => {
    const url = `https://reststop.randomhouse.com/resources/authors?lastName=${query}`
    return encodeURI(url)
  }
  const SearchTitles = async () => {
    if (!searchQuery || searchQuery.trim() === "") return;
    setLoading(true)
    setNoAuthors(false)

    const URL = prepareSearchTitles(searchQuery)
    const results = async () => {
      const response = await fetch(URL,{headers: {'Accept': 'application/json'}})
      // console.log(response)
      const data = await response.json()
      const authorList = data.author
      console.log(authorList)
      console.log(authorList[5].authordisplay)
      if (authorList && authorList.length === 0){
        setNoAuthors(true)
      }



      setAuthors(authorList)
    }
    results();
    setLoading(false)
  }
  useDebounce(searchQuery, 500, SearchTitles);

  return (
  <SearchBarContainer
  animate={isExpanded ? "expanded" : "collapsed"}
  variants={containerVariants}
  ref={clickedRef}
  transition={containerTransition}
  >

      <SearchInputContainer>
        <SearchIcon>
            <IoSearch/>
        </SearchIcon>
        <SearchInput
        placeholder="Quick Search"
         onFocus={expandContainer}
         ref={inputRef}
         value={searchQuery}
         onChange={ChangeHandler}
          />

        <AnimatePresence>
        {isExpanded && (
        <CloseIcon
          key="close-icon"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={collapseContainer}
          transition={{ duration: 0.2 }}
        >
            <IoClose/>
        </CloseIcon>
        )}
        </AnimatePresence>

      </SearchInputContainer>

      {isExpanded && <LineSeperator/>}
      {isExpanded && (
      <SearchContent>
        {isLoading && (
          <LoadingWrapper>
            <MoonLoader loading color="#000" size={20} />
          </LoadingWrapper>
         )}
         {!isLoading && isEmpty && !noAuthors && (
           <LoadingWrapper>
              <WarningMessage>Start typing to Search</WarningMessage>
            </LoadingWrapper>
         )}
         {!isLoading && noAuthors && (
           <LoadingWrapper>
           <WarningMessage>No Authors or Titles found </WarningMessage>
           </LoadingWrapper>
         )}
         {!isLoading && !isEmpty && (
         <>
          {authors.map((author) => (
              <Author
              key={author.id}
              name={author.authordisplay}
              // image={author.titles.isbn}
              />
          ))}
         </>)}
      </SearchContent>
      )}
  </SearchBarContainer>
  );
}
