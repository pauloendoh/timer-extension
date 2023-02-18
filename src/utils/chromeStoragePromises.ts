// promise wrapper on chrome.storage.sync.get

export const getSync = <T>(key: string) => {
  return new Promise<T | undefined>((resolve, reject) => {
    chrome.storage.sync.get(key, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(result[key])
      }
    })
  })
}

// sync set
export const setSync = <T>(key: string, value: T) => {
  return new Promise<T>((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(value)
      }
    })
  })
}

// sync remove
export const removeSync = (key: string) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.remove(key, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(true)
      }
    })
  })
}
