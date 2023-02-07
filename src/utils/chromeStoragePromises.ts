// promise wrapper on chrome.storage.sync.get

export const syncGet = <T>(key: string) => {
  return new Promise<T>((resolve, reject) => {
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
export const syncSet = (key: string, value: any) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(true)
      }
    })
  })
}

// sync remove
export const syncRemove = (key: string) => {
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
