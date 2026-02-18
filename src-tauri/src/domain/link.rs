use serde::{Serialize, Deserialize};
use url::Url;

#[derive(Serialize, Deserialize, Clone)]
pub struct LinkRecord {
    pub id: String,
    pub name: String,
    pub link: String,
    pub comments: Vec<String>,

    // Store original user-entered value
    pub raw: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum LinkType {
    Http,
    Https,
    Email,
    LocalFile,
    Unknown,
}

impl LinkRecord {
    pub fn new(id: String, name: String, raw: String, comments: Vec<String>) -> Self {
        Self {
            id,
            name,
            link: raw.clone(),
            raw,
            comments,
        }
    }

    pub fn is_valid(&self) -> bool {
        if let Ok(_) = Url::parse(&self.raw) {
            return true;
        }

        // Basic email check
        if self.raw.contains('@') && self.raw.contains('.') {
            return true;
        }

        false
    }

    pub fn link_type(&self) -> LinkType {
        if let Ok(url) = Url::parse(&self.raw) {
            match url.scheme() {
                "http" => LinkType::Http,
                "https" => LinkType::Https,
                "file" => LinkType::LocalFile,
                _ => LinkType::Unknown,
            }
        } else if self.raw.contains('@') {
            LinkType::Email
        } else {
            LinkType::Unknown
        }
    }

    pub fn domain(&self) -> Option<String> {
        if let Ok(url) = Url::parse(&self.raw) {
            return url.domain().map(|d| d.to_string());
        }

        None
    }

    pub fn normalized(&self) -> Option<String> {
        if let Ok(url) = Url::parse(&self.raw) {
            return Some(url.to_string());
        }
        None
    }
}
