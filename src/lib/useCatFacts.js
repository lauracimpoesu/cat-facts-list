import { useEffect, useState } from "react"

export const useCatFacts = (page = 1, limit = 10) => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPrevPage, setHasPrevPage] = useState(false)
  const [list, setList] = useState([])

  const loadRandomFacts = async (page, limit) => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `https://catfact.ninja/facts?page=${page}&limit=${limit}`
      )
      const json = await response.json()

      setList(
        json.data.map((item, idx) => ({
          id: idx + 1 + limit * (page - 1), // creating a progressive id
          fact: item.fact,
        }))
      )
      setHasNextPage(!!json.next_page_url)
      setHasPrevPage(!!json.prev_page_url)
    } catch (err) {
      // Just warn.
      console.warn(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRandomFacts(page, limit)
  }, [page, limit])

  return { list, isLoading, hasNextPage, hasPrevPage }
}
